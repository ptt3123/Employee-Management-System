# app run here

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import asyncio

from apis.routes import router
from cruds.salary_management_crud import calculate_monthly_attendance
from exceptions.exception_handler import *
from exceptions.exceptions import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(EmployeeNotFoundException, employee_not_found_handler)
app.add_exception_handler(HasRegisteredNextWeekException, has_registered_next_week_handler)
app.add_exception_handler(HasRegisteredSalaryException, has_registered_salary_handler)
app.add_exception_handler(NoScheduleRegisteredException, no_schedule_registered_handler)
app.add_exception_handler(InvalidCheckoutException, invalid_checkout_handler)
app.add_exception_handler(InvalidCheckinCheckoutException, invalid_checkin_checkout_handler)
app.add_exception_handler(InvalidPaginationException, invalid_pagination_handler)
app.add_exception_handler(FieldValueExistsException, fields_value_exist_handler)
app.add_exception_handler(UnauthorizedException, unauthorized_exception_handler)
app.add_exception_handler(UsernameOrPasswordIncorrectException, username_password_incorrect_handler)
app.add_exception_handler(PasswordIncorrectException, password_incorrect_handler)
app.add_exception_handler(ObjectNotFoundException, object_not_found_handler)
app.add_exception_handler(UsernameOrPasswordIncorrectException, username_password_incorrect_handler)
app.add_exception_handler(PasswordIncorrectException, password_incorrect_handler)
app.add_exception_handler(RequestInProcessingException, request_in_processing_handler)
app.add_exception_handler(Exception, fallback_exception_handler)

app.include_router(router)

# Create scheduler
scheduler = BackgroundScheduler()

# Define job: run at 00:00 on the 1st day of every month
trigger = CronTrigger(day=1, hour=3, minute=0)

# Wrap async function for scheduler
def run_salary_job():
    asyncio.run(calculate_monthly_attendance())

# Add job to scheduler
scheduler.add_job(run_salary_job, trigger)
scheduler.start()

