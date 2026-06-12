from app.workers.celery_app import celery_app


@celery_app.task
def test_task():
    print("Task executed")

@celery_app.task
def process_download(
    job_id: str,
):
    print(f"Processing job {job_id}")