FROM  node

RUN  mkdir /var/task
WORKDIR  /var/task
RUN  npm install -y mysql express http
RUN  npm install --save express
RUN  npm install -y ejs express-session session-file-store
RUN  wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem

COPY  register.js /var/task/

CMD  [ "node", "register.js" ]

EXPOSE	3000
