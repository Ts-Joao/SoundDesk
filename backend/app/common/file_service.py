from pathlib import Path


class FileService:
    BASE_DIR = Path("storage")

    def delete_audio(self, file_path: str | None) -> None:
        self._delete(file_path)

    def delete_cover(self, cover_path: str | None) -> None:
        self._delete(cover_path)

    def delete_zip(self, file_path: str | None) -> None:
        self._delete(file_path)

    def _delete(self, relative_path: str | None) -> None:
        if not relative_path:
            return

        path = self.BASE_DIR / relative_path
        if path.exists():
            path.unlink()
