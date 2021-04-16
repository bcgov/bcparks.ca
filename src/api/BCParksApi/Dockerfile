FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
# COPY ["BCParksApi.csproj", ""]

COPY . .
# WORKDIR "/src/."
RUN dotnet restore "./BCParksApi.csproj"
RUN dotnet build "BCParksApi.csproj" -c Release -o /app/build
RUN dotnet publish "BCParksApi.csproj" -c Release -o /app/publish

FROM registry.redhat.io/rhel8/dotnet-50-runtime AS base
WORKDIR /opt/app-root
EXPOSE 5000
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "BCParksApi.dll"]
