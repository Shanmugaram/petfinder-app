pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = "dockerhub-creds-id"
    SSH_CREDENTIALS = "ssh-deploy-creds-id"
    IMAGE_NAME = "YOUR_DOCKERHUB_USERNAME/petfinder-backend"
    DEPLOY_DIR = "/home/ubuntu/petfinder-deploy"
    DEPLOY_HOST = "YOUR.EC2.IP.HERE"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test') {
      steps {
        dir('backend') {
          sh 'npm ci'
          sh 'npm test'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
            def img = docker.build("${env.IMAGE_NAME}:latest", "backend")
            img.push()
          }
        }
      }
    }

    stage('Deploy to Test Host') {
      steps {
        sshagent([SSH_CREDENTIALS]) {
          sh """
            ssh -o StrictHostKeyChecking=no ubuntu@${DEPLOY_HOST} '
              mkdir -p ${DEPLOY_DIR} &&
              cd ${DEPLOY_DIR} &&
              docker pull ${IMAGE_NAME}:latest &&
              docker compose down &&
              docker compose up -d
            '
          """
        }
      }
    }
  }
}

