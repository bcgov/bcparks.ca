FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["BCParksApi.csproj", ""]
RUN dotnet restore "./BCParksApi.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "BCParksApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BCParksApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BCParksApi.dll"]
