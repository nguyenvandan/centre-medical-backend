docker rm -f medika-backend
docker build -t medika/medika-backend . 
docker run -p 3000:3000 -d --env-file .env --name medika-backend medika/medika-backend:latest