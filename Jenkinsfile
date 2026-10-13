pipeline {
    agent any

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
}
