pipeline {
    agent any

    parameters {
        string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'Tag for the Docker image')
    }

    environment {
        DOCKER_IMAGE = "rahul69980/invenory_image:${params.IMAGE_TAG}"
        DOCKER_REPO = "rahul69980/invenory_image"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/rahul69980/Inventry-Management-Project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'Docker_credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh "docker tag ${DOCKER_IMAGE} ${DOCKER_REPO}:${params.IMAGE_TAG}"
                    sh "docker push ${DOCKER_REPO}:${params.IMAGE_TAG}"
                }
            }
        }

        stage('Docker Compose Test') {
            steps {
                echo '🧪 Running Docker Compose test...'
                sh '/usr/local/bin/docker-compose up -d --build'
                sh '/usr/local/bin/docker-compose ps'
                sh '/usr/local/bin/docker-compose down'
            }
        }

        stage('Deploy MongoDB to Kubernetes') {
            steps {
                echo '📦 Deploying MongoDB...'
                sh 'kubectl apply -f mongodb-deployement.yaml --validate=false'
            }
        }

        stage('Deploy App to Kubernetes') {
            steps {
                echo '🚀 Deploying Application...'
                sh 'kubectl apply -f app-deployement.yaml --validate=false'
            }
        }

        stage('Deploy Datadog Agent') {
            steps {
                echo '📈 Deploying Datadog Agent...'
                sh 'kubectl apply -f datadog-agent.yaml --validate=false'
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
            echo "✅ Build and deployment completed successfully!"
        }
        failure {
            echo "❌ Build or deployment failed. Check logs for details."
        }
    }
}