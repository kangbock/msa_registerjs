FROM  node

RUN  mkdir /var/task
WORKDIR  /var/task
RUN  npm install -y mysql express http
RUN  npm install --save express
RUN  npm install -y ejs express-session session-file-store
RUN  wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem

COPY  nodejs/main3.js /var/task/
COPY  nodejs/package.js /var/task/

CMD  [ "node", "main3.js" ]

EXPOSE	3000
