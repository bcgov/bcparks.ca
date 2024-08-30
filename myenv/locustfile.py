from locust import HttpUser, task, between

class QuickStartUser(HttpUser):
    host = "http://localhost:8000/"
    wait_time = between(1, 5)


    @task
    def index_page(self):
        self.client.get("/")
