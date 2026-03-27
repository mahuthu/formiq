# Deployment Guide for FormIQ

This guide outlines the steps to deploy FormIQ to a remote Linux server (e.g., DigitalOcean Droplet, AWS EC2, or a private VPS).

## 1. Server Prerequisites

Your server should be running **Ubuntu 22.04 LTS** or similar. You need to install the following:

### Install Docker and Docker Compose
```bash
# Update package list and install dependencies
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose (v2)
sudo apt install -y docker-compose-plugin
```

### Install Nginx and Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

## 2. Environment Configuration

On your server, create a `.env` file in the project root.

### Production Variable Checklist (IP: 20.250.163.236):
- `DATABASE_URL`: `postgresql://formiq:YOUR_SECURE_PASSWORD@localhost:5436/formiq`
- `POSTGRES_PASSWORD`: Use a strong, unique password.
- `JWT_SECRET`: Generate with `openssl rand -hex 32`.
- `FRONTEND_URL`: `http://20.250.163.236:9000`
- `NEXT_PUBLIC_API_URL`: `http://20.250.163.236:9000/api`
- `S3_*`: Populate with your production credentials.

## 3. Nginx Setup (IP-based, Port 9000)

1.  Copy `nginx.ip.conf` to `/etc/nginx/sites-available/formiq`.
2.  Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/formiq /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

> [!NOTE]
> We are using port `9000` for the main entry point to avoid conflicts with common ports used by Django (8000/8080). Ensure your VM firewall (e.g., Azure or cloud security group) allows incoming traffic on port **9000**.

## 4. Run the Application

1.  Clone the repository: `git clone https://github.com/your-repo/formiq.git`
2.  Navigate to the directory: `cd formiq`
3.  Ensure your `.env` is ready.
4.  Run the deployment script: `./deploy.sh`

The application will be accessible at: `http://20.250.163.236:9000`

The script will:
- Pull the latest code.
- Build the Docker images.
- Start the containers in the background.
- Run the latest Prisma database migrations.

## 5. Maintenance

### View Logs
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Update the Application
Simply run the `./deploy.sh` script whenever you push changes to your `main` branch.
