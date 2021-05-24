docker build -t 869969654446.dkr.ecr.eu-west-1.amazonaws.com/medika-backend:v1 -f Dockerfile-release .
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 869969654446.dkr.ecr.eu-west-1.amazonaws.com
docker push 869969654446.dkr.ecr.eu-west-1.amazonaws.com/medika-backend:v1