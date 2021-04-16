FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
ARG ADMIN_JWT_SECRET
ARG ASPNETCORE_ENVIRONMENT
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_CMS_BASE_URL
ARG REACT_APP_FRONTEND_BASE_URL
ARG REACT_APP_KEYCLOAK_AUTH_URL
ARG REACT_APP_KEYCLOAK_REALM
ARG REACT_APP_KEYCLOAK_CLIENT_ID

ENV ASPNETCORE_ENVIRONMENT=$ASPNETCORE_ENVIRONMENT
ENV ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_CMS_BASE_URL=$REACT_APP_CMS_BASE_URL
ENV REACT_APP_FRONTEND_BASE_URL=$REACT_APP_FRONTEND_BASE_URL
ENV REACT_APP_KEYCLOAK_AUTH_URL=$REACT_APP_KEYCLOAK_AUTH_URL
ENV REACT_APP_KEYCLOAK_REALM=$REACT_APP_KEYCLOAK_REALM
ENV REACT_APP_KEYCLOAK_CLIENT_ID=$REACT_APP_KEYCLOAK_CLIENT_ID


WORKDIR /src
# COPY ["BCParksApi.csproj", ""]

COPY . .
# WORKDIR "/src/."

RUN printenv && \
    echo "Populating environment..." && \
    (eval "echo \"$(cat ./appsettings.json.template )\"" ) > ./appsettings.json && \
    chmod 766 ./appsettings.json && \
    cat ./appsettings.json
RUN dotnet restore "./BCParksApi.csproj"
RUN dotnet build "BCParksApi.csproj" -c Release -o /app/build
RUN dotnet publish "BCParksApi.csproj" -c Release -o /app/publish

# FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
# WORKDIR /opt/app-root
FROM registry.redhat.io/ubi8/dotnet-50-runtime AS base

EXPOSE 5000
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "BCParksApi.dll"]
