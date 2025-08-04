from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc
from entities.salary import Salary
from entities.employee import Employee
from schemas.salary import SalaryCreate, SalaryUpdate
from typing import Optional, Tuple, List

class SalaryCRUD:
    def __init__(self, db: Session):
        self.db = db

    def create_salary(self, salary_data: SalaryCreate) -> Salary:
        """Create a new salary record"""
        db_salary = Salary(**salary_data.dict())
        self.db.add(db_salary)
        self.db.commit()
        self.db.refresh(db_salary)
        return db_salary

    def get_salary_by_employee_id(self, employee_id: int) -> Optional[Salary]:
        """Get salary by employee ID"""
        return self.db.query(Salary).filter(Salary.employee_id == employee_id).first()

    def update_salary(self, employee_id: int, salary_data: SalaryUpdate) -> Optional[Salary]:
        """Update salary record"""
        db_salary = self.get_salary_by_employee_id(employee_id)
        if not db_salary:
            return None
        
        update_data = salary_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_salary, field, value)
        
        self.db.commit()
        self.db.refresh(db_salary)
        return db_salary

    def delete_salary(self, employee_id: int) -> bool:
        """Delete salary record"""
        db_salary = self.get_salary_by_employee_id(employee_id)
        if not db_salary:
            return False
        
        self.db.delete(db_salary)
        self.db.commit()
        return True

    def get_salaries_with_employee_info(
        self, 
        page: int = 1, 
        per_page: int = 10,
        search: Optional[str] = None,
        sort_by: Optional[str] = "employee_id",
        sort_order: Optional[str] = "asc"
    ) -> Tuple[List[Salary], int]:
        """Get salaries with employee information"""
        query = self.db.query(Salary).join(Employee)
        
        # Apply search filter
        if search:
            search_filter = or_(
                Employee.name.ilike(f"%{search}%"),
                Employee.email.ilike(f"%{search}%"),
                Employee.position.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        # Apply sorting
        if sort_by and sort_order:
            if sort_by == "employee_name":
                sort_column = Employee.name
            elif sort_by == "employee_email":
                sort_column = Employee.email
            elif sort_by == "employee_position":
                sort_column = Employee.position
            elif sort_by == "salary":
                sort_column = Salary.salary
            elif sort_by == "allowance":
                sort_column = Salary.allowance
            elif sort_by == "reward":
                sort_column = Salary.reward
            elif sort_by == "create_date":
                sort_column = Salary.create_date
            else:
                sort_column = Salary.employee_id
            
            if sort_order.lower() == "desc":
                query = query.order_by(desc(sort_column))
            else:
                query = query.order_by(asc(sort_column))
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * per_page
        salaries = query.offset(offset).limit(per_page).all()
        
        return salaries, total

    def get_all_salaries(self) -> List[Salary]:
        """Get all salary records"""
        return self.db.query(Salary).join(Employee).all()
