app.mount("/employee_api", employee_app)




from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from employee_db import app as employee_app