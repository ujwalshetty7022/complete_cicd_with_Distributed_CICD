pipeline {
    agent none

    stages {

        stage('Checkout Code') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Deploy on All Nodes') {
            parallel {

                stage('Deploy on slave-1') {
                    agent { label 'backend' }  // slave-1
                    steps {
                        sh '''
                        echo "Deploying on Slave-1"

                        docker compose down || true
                        docker compose up -d --build
                        '''
                    }
                }

                stage('Deploy on slave-2') {
                    agent { label 'frontend' }  // slave-2
                    steps {
                        sh '''
                        echo "Deploying on Slave-2"

                        docker compose down || true
                        docker compose up -d --build
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ App deployed on BOTH nodes!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}