1. Redis - docker run --name redis -p 6379:6379 -d redis
2. Grafana и Prom docker run -d -p 3030:3030 \
   --name=grafana \
   -e "GF_SECURITY_ADMIN_PASSWORD=admin" \
   -v grafana-storage:/var/lib/grafana \
   grafana/grafana:latest
3. Swagger UI http://localhost:4202/swagger