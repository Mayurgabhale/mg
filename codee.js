class DailyTravel(Base):
    __tablename__ = "daily_travel"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    emp_id = Column(String, index=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    from_location = Column(String, nullable=True)
    from_country = Column(String, nullable=True)   # ✅ add this
    to_location = Column(String, nullable=True)
    to_country = Column(String, nullable=True)     # ✅ add this
    begin_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    leg_type = Column(String, nullable=True)
    active_now = Column(Integer, default=0)
    is_vip = Column(Integer, default=0)
    matched_employee_id = Column(String, nullable=True)
    matched_employee_name = Column(String, nullable=True)
    match_reason = Column(String, nullable=True)
    uploaded_at = Column(String, nullable=True)