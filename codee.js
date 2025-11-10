from datetime import datetime
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import relationship

class MonthlyUpload(Base):
    __tablename__ = "monthly_uploads"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    file_name = Column(String)
    upload_time = Column(DateTime, default=datetime.utcnow)

    # Relationship (optional, for ORM joins)
    employees = relationship("Employee", back_populates="upload")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(String, index=True)
    last_name = Column(String)
    first_name = Column(String)
    preferred_first_name = Column(String)
    middle_name = Column(String)
    full_name = Column(String)
    current_status = Column(String)
    employee_type = Column(String)
    hire_date = Column(String)
    job_code = Column(String)
    position_id = Column(String)
    business_title = Column(String)
    department_name = Column(String)
    company_name = Column(String)
    work_country = Column(String)
    location_description = Column(String)
    location_city = Column(String)
    management_level = Column(String)
    manager_name = Column(String)
    employee_email = Column(String)
    manager_email = Column(String)
    fte = Column(Float)
    tenure = Column(String)
    years_of_service = Column(Float)
    length_of_service_months = Column(Float)
    time_in_position_months = Column(Float)

    # New foreign key
    upload_id = Column(Integer, ForeignKey("monthly_uploads.id"))
    upload = relationship("MonthlyUpload", back_populates="employees")