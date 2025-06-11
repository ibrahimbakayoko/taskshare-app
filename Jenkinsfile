pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'dnais1210/taskshare'
        DOCKER_CREDENTIALS = 'dockerhub-taskshare'
        SONARQUBE_ENV = 'Sonarqube'
        SONARQUBE_TOKEN = credentials('taskshare-token')
        SONAR_HOST_URL = 'http://192.168.27.21:9000/'
        KUBECONFIG_PATH = '/var/lib/jenkins/.kube/config'
    }

    stages {
        stage('Cloner le code') {
            steps {
                git branch: 'main', url: 'https://github.com/ibrahimbakayoko/taskshare-app.git'
            }
        }

        stage('Tests & couverture') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npx mocha ./test/basic.test.js --reporter mocha-junit-reporter --reporter-options mochaFile=./test-results/results.xml'
                    sh 'npx nyc report --reporter=text-lcov > coverage.lcov'
                }
            }
        }

        stage('Analyse SonarQube') {
            steps {
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    sh """
                        sonar-scanner \
                        -Dsonar.projectKey=taskmanager \
                        -Dsonar.sources=./backend \
                        -Dsonar.javascript.lcov.reportPaths=./backend/coverage.lcov \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONARQUBE_TOKEN
                    """
                }
            }
        }

        stage('Construire l’image Docker') {
            steps {
                sh """
                    docker build -t $DOCKER_IMAGE:$BUILD_NUMBER -t $DOCKER_IMAGE:latest backend/
                """
            }
        }

        stage('Pousser sur Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: "$DOCKER_CREDENTIALS", url: ""]) {
                    sh """
                        docker push $DOCKER_IMAGE:$BUILD_NUMBER
                        docker push $DOCKER_IMAGE:latest
                    """
                }
            }
        }

        stage('Déploiement sur TEST') {
            steps {
                withEnv(["KUBECONFIG=$KUBECONFIG_PATH"]) {
                    sh """
                        helm upgrade --install taskshare-backend ./helm-chart \
                            --set image.repository=$DOCKER_IMAGE \
                            --set image.tag=$BUILD_NUMBER \
                            -n test --create-namespace
                    """
                }
            }
        }

        stage('Approval for Production') {
            steps {
                input message: "Déployer en production ?"
            }
        }

        stage('Déploiement sur PRODUCTION') {
            steps {
                withEnv(["KUBECONFIG=$KUBECONFIG_PATH"]) {
                    sh """
                        helm upgrade --install taskshare-backend ./helm-chart \
                            --set image.repository=$DOCKER_IMAGE \
                            --set image.tag=$BUILD_NUMBER \
                            -n taskshare --create-namespace
                    """
                }
            }
        }
    }

    post {
        always {
            junit 'backend/test-results/results.xml'
        }
    }
}
