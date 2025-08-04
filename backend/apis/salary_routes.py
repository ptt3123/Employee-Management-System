from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from cruds.salary import SalaryCRUD
from schemas.salary import SalaryCreate, SalaryUpdate, SalaryResponse, SalaryListResponse
from entities.employee import Employee

router = APIRouter(prefix="/salary", tags=["salary"])

@router.post("/", response_model=SalaryResponse)
async def create_salary(
    salary_data: SalaryCreate,
    db: Session = Depends(get_db)
):
    """Create a new salary record"""
    salary_crud = SalaryCRUD(db)
    
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.id == salary_data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if salary already exists for this employee
    existing_salary = salary_crud.get_salary_by_employee_id(salary_data.employee_id)
    if existing_salary:
        raise HTTPException(status_code=400, detail="Salary record already exists for this employee")
    
    salary = salary_crud.create_salary(salary_data)
    
    # Prepare response with employee info
    response = SalaryResponse(
        salary=salary.salary,
        allowance=salary.allowance,
        reward=salary.reward,
        detail=salary.detail,
        employee_id=salary.employee_id,
        create_date=salary.create_date,
        update_date=salary.update_date,
        employee_name=employee.name,
        employee_email=employee.email,
        employee_position=employee.position
    )
    
    return response

@router.get("/", response_model=SalaryListResponse)
async def get_salaries(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("employee_id"),
    sort_order: Optional[str] = Query("asc"),
    db: Session = Depends(get_db)
):
    """Get all salary records with pagination and search"""
    salary_crud = SalaryCRUD(db)
    salaries, total = salary_crud.get_salaries_with_employee_info(
        page=page,
        per_page=per_page,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    # Prepare response with employee info
    salary_responses = []
    for salary in salaries:
        employee = db.query(Employee).filter(Employee.id == salary.employee_id).first()
        salary_response = SalaryResponse(
            salary=salary.salary,
            allowance=salary.allowance,
            reward=salary.reward,
            detail=salary.detail,
            employee_id=salary.employee_id,
            create_date=salary.create_date,
            update_date=salary.update_date,
            employee_name=employee.name if employee else None,
            employee_email=employee.email if employee else None,
            employee_position=employee.position if employee else None
        )
        salary_responses.append(salary_response)
    
    return SalaryListResponse(
        salaries=salary_responses,
        total=total,
        page=page,
        per_page=per_page
    )

@router.get("/{employee_id}", response_model=SalaryResponse)
async def get_salary_by_employee_id(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """Get salary by employee ID"""
    salary_crud = SalaryCRUD(db)
    salary = salary_crud.get_salary_by_employee_id(employee_id)
    
    if not salary:
        raise HTTPException(status_code=404, detail="Salary not found")
    
    # Get employee info
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    response = SalaryResponse(
        salary=salary.salary,
        allowance=salary.allowance,
        reward=salary.reward,
        detail=salary.detail,
        employee_id=salary.employee_id,
        create_date=salary.create_date,
        update_date=salary.update_date,
        employee_name=employee.name if employee else None,
        employee_email=employee.email if employee else None,
        employee_position=employee.position if employee else None
    )
    
    return response

@router.put("/{employee_id}", response_model=SalaryResponse)
async def update_salary(
    employee_id: int,
    salary_data: SalaryUpdate,
    db: Session = Depends(get_db)
):
    """Update salary record"""
    salary_crud = SalaryCRUD(db)
    salary = salary_crud.update_salary(employee_id, salary_data)
    
    if not salary:
        raise HTTPException(status_code=404, detail="Salary not found")
    
    # Get employee info
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    response = SalaryResponse(
        salary=salary.salary,
        allowance=salary.allowance,
        reward=salary.reward,
        detail=salary.detail,
        employee_id=salary.employee_id,
        create_date=salary.create_date,
        update_date=salary.update_date,
        employee_name=employee.name if employee else None,
        employee_email=employee.email if employee else None,
        employee_position=employee.position if employee else None
    )
    
    return response

@router.delete("/{employee_id}")
async def delete_salary(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """Delete salary record"""
    salary_crud = SalaryCRUD(db)
    success = salary_crud.delete_salary(employee_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Salary not found")
    
    return {"message": "Salary deleted successfully"}
