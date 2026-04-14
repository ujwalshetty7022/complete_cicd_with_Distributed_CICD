# Distributed CI/CD Pipeline with Containerized Deployment and Monitoring

## Overview

This project demonstrates the implementation of a distributed CI/CD pipeline using Jenkins to automate the build and deployment of a containerized web application across multiple AWS EC2 instances. 
It integrates centralized logging and monitoring using AWS CloudWatch to provide observability into application behavior under load.

---

## Architecture


GitHub → Jenkins Master → Jenkins Agents → Docker Containers → Application → AWS CloudWatch


---

## Tech Stack

* CI/CD: Jenkins (Declarative Pipeline)
* Version Control: Git, GitHub
* Containerization: Docker, Docker Compose
* Cloud: AWS EC2
* Monitoring: AWS CloudWatch
* Backend: FastAPI (Python)
* Frontend: Nginx (Static Web Application)

---

## Project Structure


analyster/
├── backend/
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── script.js
│   └── style.css
├── docker-compose.yml
├── Jenkinsfile

---

## CI/CD Pipeline

The Jenkins pipeline performs the following steps:

1. **Checkout Code**

   * Fetches source code from GitHub repository

2. **Distributed Deployment**

   * Executes deployment in parallel across multiple Jenkins agents
   * Uses label-based node assignment for workload distribution

3. **Container Execution**

   * Builds Docker images
   * Runs services using Docker Compose

---

## Docker Configuration

### Backend

* FastAPI application served using Uvicorn
* Port mapping: `8080:8000`

### Frontend

* Static content served via Nginx
* Port mapping: `3000:80`

---

## Application Access

* Frontend: `http://<EC2-IP>:3000`
* Backend: `http://<EC2-IP>:8080`
* API Docs: `http://<EC2-IP>:8080/docs`

---

## Monitoring with AWS CloudWatch

### Log Collection

CloudWatch Agent is configured to collect logs from Docker containers:

```
/var/lib/docker/containers/*/*.log
```

### Log Group

```
docker-logs
```

---

## Log Analysis (CloudWatch Logs Insights)

### Requests Per Second

```sql
fields @timestamp
| filter @message like "GET"
| stats count() by bin(1s)
```

### HTTP Status Distribution

```sql
fields @message
| filter @message like "GET"
| parse @message '*"GET * *" *' as path, protocol, status
| stats count() by status
```

---

## Visualization

CloudWatch dashboards are used to visualize:

* Line Chart: Request rate over time
* Bar Chart: Request volume comparison
* Pie Chart: HTTP status code distribution

---

## Load Testing

### ApacheBench

```
ab -n 200 -c 20 http://<EC2-IP>:8080/docs
```

### Continuous Load Generation

```
while true; do
  for i in {1..10}; do curl -s http://<EC2-IP>:8080/docs > /dev/null & done
  wait
  sleep 1
done
```

---

## Features

* Automated CI/CD pipeline
* Distributed deployment using Jenkins agents
* Containerized application architecture
* Centralized logging with CloudWatch
* Real-time monitoring and log streaming
* Load testing and performance analysis

---

## Future Improvements

* GitHub Webhooks for automated triggers
* Alerting using AWS SNS
* Reverse proxy integration (Nginx or ALB)
* Kubernetes deployment (EKS)
* Advanced monitoring with Prometheus and Grafana

---

## Conclusion

This project demonstrates a complete DevOps workflow combining automation, containerization, distributed deployment, and centralized monitoring, aligned with real-world production practices.

---
