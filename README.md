# master_for_an_hour
This will be my university individual project - Master for an Hour – Call Control System for Minor Repairs,
________________________________________
# Users Definition:
The application will serve the following types of users:
Customer:
  Responsibilities:
  Create repair service requests.
  Select the type of repair (e.g., plumbing, electrical work, painting, furniture assembly, etc.).
  Provide details such as address and preferred service date/time.
  Track the status of their repair requests.
  View history of completed repairs.
___________________
Operator (Dispatcher):
Responsibilities:
  Review incoming repair requests.
  Assign masters to specific tasks based on availability and skill.
  Update request statuses (e.g., New, Assigned, In Progress, Completed, Cancelled).
  Manage the list of available masters, including their status and performance.
___________________
Master (Worker):
Responsibilities:
  View and manage assigned repair tasks.
  Update task progress (mark as in-progress, completed, etc.).
  Add notes related to completed tasks (e.g., issues encountered, recommendations).
  Ensure communication with both customers and operators as needed.
________________________________________
# Functionality Definition:
  The application will support the following core features:
  User Registration and Authentication:
  Allow customers, operators, and masters to register with the system and log in securely.
___________________
Repair Request Management:
  Enable customers to create new repair requests by specifying type, description, address, and preferred date/time.
  Allow customers to modify or cancel requests before assignment.
___________________
Request Assignment and Status Updates:
  Operators can assign repair tasks to available masters based on expertise and availability.
  Operators and masters can update the status of requests (e.g., New, Assigned, In Progress, Completed).
  Customers will be notified of any changes in request status.
___________________
Repair History:
  Customers and operators can view a history of completed repairs, including details like service type, date, and task completion status.
___________________
Data Storage and Management:
  Store repair requests and task data in a Supabase database for persistence and scalability.
  Provide an option to save and load data for requests, including users and task progress.
___________________
Input Validation and Error Handling:
  Ensure all user inputs (address, date/time, repair description) are validated and error-free.
  Display clear error messages to guide users in case of incorrect or missing information.
___________________
Basic Statistics and Reports:
  Provide operators with statistics such as the number of completed jobs, active requests, and task performance metrics.
________________________________________
# Platform:
Web Application designed for seamless access from desktop and mobile devices in the future.
Frontend: Django (with Python and JavaScript)
Backend: Django (Python) with Supabase for real-time database handling.
________________________________________
# Programming Languages and Tools:
Primary Language: Python
Framework: Django for backend management
Database: Supabase (for data storage and user authentication)
Frontend: Django templates for user interface
Development Paradigm: Object-Oriented Programming (OOP)
