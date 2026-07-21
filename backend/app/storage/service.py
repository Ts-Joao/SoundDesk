import io
from pathlib import Path
from uuid import uuid4

from PIL import Image, ImageOps
from fastapi import UploadFile, File

from app.exceptions.exceptions import BadRequestException


class StorageService:
    def __init__(self):
        pass

    AVATAR_PATH = Path("storage/avatars")

    async def save_avatar(self, file: UploadFile = File(...)):
        self.validate_image(file)
        avatar = await file.read()

        try:
            image = Image.open(io.BytesIO(avatar))
            image = ImageOps.exif_transpose(image)

            if image.mode != "RGB":
                image = image.convert("RGB")

            size = (256, 256)
            processed_image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)
        except Exception:
            raise BadRequestException("Something went wrong")

        filename = self.generate_filename()
        self.AVATAR_PATH.mkdir(parents=True, exist_ok=True)
        file_path = self.AVATAR_PATH / f"{filename}.jpg"
        processed_image.save(file_path, format="WEBP", quality=90)
        return file_path

    @staticmethod
    def validate_image(file: UploadFile = File(...)):
        types = file.content_type
        size = file.size
        allowed_types = ["png", "jpg", "jpeg", "webp"]
        max_size = 5 * 1024 * 1024

        if types not in allowed_types:
            raise BadRequestException("Invalid file type")

        if size > max_size:
            raise BadRequestException("File too large")

    @staticmethod
    def generate_filename():
        filename = uuid4()
        return filename

    @staticmethod
    def delete_avatar(url: str):
        if not url:
            raise BadRequestException("Invalid file path")

        file_path = Path(url)
        file_path.unlink(missing_ok=True)