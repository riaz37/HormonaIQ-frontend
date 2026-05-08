from fastapi import APIRouter

from app.api.v1 import auth, data, ora, report, user

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(user.router, prefix="/user", tags=["user"])
router.include_router(ora.router, prefix="/ora", tags=["ora"])
router.include_router(report.router, prefix="/report", tags=["report"])
router.include_router(data.router, prefix="/data", tags=["data"])
