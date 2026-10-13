pipeline {
    agent any

    environment {
        PATH+NODE = "${env.HOME}/.nvm/versions/node/v20.12.0/bin"
    }

    parameters {
        choice(
            name: 'TEST_PROJECT',
            choices: ['chrome:test', 'ios_mobile:test', 'android_mobile:test'],
            description: 'Select the Playwright project to run'
        )
    }

    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Playwright tests') {
            steps {
                sh "npm run ${params.TEST_PROJECT}"
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }
    }
}
