FROM paperbenni/node
WORKDIR /home/user
RUN apk add ffmpeg
COPY package.json package.json
COPY start.sh start.sh
RUN chmod +x start.sh
COPY index.js index.js

CMD /home/user/start.sh
