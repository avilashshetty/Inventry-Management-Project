pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'rahul69980/invenory_image'
        IMAGE_TAG = '5'
        LATEST_TAG = 'latest'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo '🔄 Checking out source code...'
                git url: 'https://github.com/rahul69980/Inventry-Management-Project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🛠️ Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:${LATEST_TAG}"
            }
        }

        stage('Docker Compose Test') {
            steps {
                echo '🧪 Running Docker Compose test...'
                sh 'docker-compose up -d --build'
                sh 'docker-compose ps'
                sh 'docker-compose down'
            }
        }

        stage('Push Docker Image') {
            steps {
                echo '📤 Pushing Docker image to Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'Dockerhub_credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
                sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
                sh "docker push ${DOCKER_IMAGE}:${LATEST_TAG}"
            }
        }

        stage('Deploy MongoDB to Kubernetes') {
            steps {
                echo '📦 Deploying MongoDB...'
                sh 'kubectl apply -f mongodb-deployement.yaml'
            }
        }

        stage('Deploy App to Kubernetes') {
            steps {
                echo '🚀 Deploying Application...'
                sh 'kubectl apply -f app-deployement.yaml'
            }
        }

        stage('Deploy Datadog Agent') {
            steps {
                echo '📈 Deploying Datadog Agent...'
                sh 'kubectl apply -f datadog-agent.yaml'
            }
        }

        stage('Get LoadBalancer URL') {
            steps {
                echo '🌐 Fetching LoadBalancer URL...'
                sh 'kubectl get svc inventory-service -o jsonpath="{.status.loadBalancer.ingress[0].hostname}"'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment succeeded!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}