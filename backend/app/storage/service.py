import io
from pathlib import Path
from uuid import uuid4

from PIL import Image, ImageOps
from fastapi import UploadFile

from app.exceptions.exceptions import BadRequestException


class StorageService:
    AVATAR_PATH = Path("storage/avatars")

    async def save_avatar(self, file: UploadFile) -> Path:
        self.validate_image(file)

        avatar = await file.read()

        if len(avatar) > 5 * 1024 * 1024:
            raise BadRequestException("File too large")

        try:
            image = Image.open(io.BytesIO(avatar))
            image = ImageOps.exif_transpose(image)

            if image.mode != "RGB":
                image = image.convert("RGB")

            size = (256, 256)
            processed_image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)
        except Exception:
            raise BadRequestException("Invalid or corrupted image file")

        filename = self.generate_filename()
        self.AVATAR_PATH.mkdir(parents=True, exist_ok=True)

        file_path = self.AVATAR_PATH / f"{filename}.webp"

        processed_image.save(file_path, format="WEBP", quality=90)
        return file_path

    @staticmethod
    def validate_image(file: UploadFile):
        allowed_types = {"image/png", "image/jpeg", "image/jpg", "image/webp"}

        if file.content_type not in allowed_types:
            raise BadRequestException("Invalid file type. Allowed: PNG, JPEG, WebP")

    @staticmethod
    def generate_filename() -> str:
        return str(uuid4())

    @staticmethod
    def delete_avatar(url: str):
        if not url:
            raise BadRequestException("Invalid file path")

        file_path = Path(url)
        file_path.unlink(missing_ok=True)