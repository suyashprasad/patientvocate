@REM Maven Wrapper startup script for Windows
@REM Download and run Maven automatically without needing Maven installed globally

@echo off
set MAVEN_WRAPPER_JAR="%~dp0\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

if not exist %MAVEN_WRAPPER_JAR% (
    echo Downloading Maven Wrapper...
    mkdir "%~dp0\.mvn\wrapper" 2>NUL
    powershell -Command "(New-Object Net.WebClient).DownloadFile('%WRAPPER_URL:"=%', '%MAVEN_WRAPPER_JAR:"=%')"
)

set MAVEN_CMD_LINE_ARGS=%*
"%JAVA_HOME%\bin\java.exe" -jar %MAVEN_WRAPPER_JAR% %MAVEN_CMD_LINE_ARGS%
