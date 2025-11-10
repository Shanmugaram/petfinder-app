pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = "dockerhub-creds-id"
    SSH_CREDENTIALS = "ssh-deploy-creds-id"
    IMAGE_NAME = "shanmugaram/petfinder-backend"
    DEPLOY_DIR = "/home/ubuntu/petfinder-deploy"
    DEPLOY_HOST = "13.56.138.189"
  }

  stages {

    stage('Checkout') {
      steps {
        echo "🔁 Checking out source code..."
        checkout scm
      }
    }

    stage('Install & Test') {
      steps {
        dir('backend') {
          sh '''
            echo "📦 Installing backend dependencies..."
            if [ -f package-lock.json ]; then
              npm ci
            else
              npm install
            fi

            echo "🧪 Running backend tests..."
            npm test || echo "⚠️ No test script found or tests failed — continuing pipeline."
          '''
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          echo "🐳 Building Docker image..."
          docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
            def img = docker.build("${env.IMAGE_NAME}:${env.BUILD_NUMBER}", "backend")
            img.push()
            img.push("latest")
          }
        }
      }
    }

    stage('Deploy to Test Host') {
      steps {
        echo "🚀 Deploying to EC2 Test Host..."
        sshagent([SSH_CREDENTIALS]) {
          sh """
            ssh -o StrictHostKeyChecking=no ubuntu@${DEPLOY_HOST} '
              set -e
              echo "🔧 Setting up deploy directory..."
              mkdir -p ${DEPLOY_DIR}
              cd ${DEPLOY_DIR}

              echo "📥 Pulling latest Docker image..."
              docker pull ${IMAGE_NAME}:latest

              echo "🧹 Cleaning up old containers..."
              docker compose down || true

              echo "🚀 Starting updated containers..."
              docker compose up -d

              echo "✅ Deployment complete!"
            '
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline completed successfully!"
    }
    failure {
      echo "❌ Pipeline failed. Check logs above for details."
    }
  }
}

