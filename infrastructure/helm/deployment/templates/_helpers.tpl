{{/*
Expand the name of the chart.
*/}}
{{- define "bcparks.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "bcparks.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "bcparks.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "bcparks.labels" -}}
helm.sh/chart: {{ include "bcparks.chart" . }}
{{ include "bcparks.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "bcparks.selectorLabels" -}}
app.kubernetes.io/name: {{ include "bcparks.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "bcparks.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "bcparks.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Gets the suffix of the namespace. (-dev, -tools, ... )
*/}}
{{- define "bcparks.namespaceSuffix" }}
{{- (split "-" .Release.Namespace)._1 | trim -}}
{{- end }}

{{ define "bcparks_cms_volume_claim" -}}
{{ .Release.Name }}-cms
{{- end -}}

{{ define "bcparks_cms_secret" -}}
{{ .Release.Name }}-cms-secret
{{- end -}}

{{ define "bcparks_cms_external_url" -}}
https://{{ .Release.Name }}-{{ .Values.cms.componentName }}-{{ .Release.Namespace }}.{{ .Values.cluster.domain }}
{{- end -}}

{{ define "bcparks_public_external_url" -}}
https://{{ .Release.Name }}-{{ .Values.public.componentName }}-{{ .Release.Namespace }}.{{ .Values.cluster.domain }}
{{- end -}}

{{ define "bcparks_etl_fullname" -}}
{{ .Release.Name }}-{{ .Values.etl.componentName }}
{{- end -}}

{{/* Secret names shared by component templates and their consumers. */}}
{{ define "bcparks_redis_secret" -}}
{{ .Release.Name }}-{{ .Values.redis.componentName }}-secret
{{- end -}}

{{ define "bcparks_scheduler_fullname" -}}
{{ .Release.Name }}-{{ .Values.scheduler.componentName }}
{{- end -}}

{{ define "bcparks_scheduler_secret" -}}
{{ .Release.Name }}-{{ .Values.scheduler.componentName }}-secret
{{- end -}}

{{ define "bcparks_strapi_token_secret" -}}
{{ .Release.Name }}-strapi-token
{{- end -}}

{{ define "bcparks_vault_managed_secret" -}}
{{ .Release.Name }}-vault-managed-secret
{{- end -}}

{{/*
Vault KV mount for the release namespace:
<license plate>-prod in the prod namespace, otherwise <license plate>-nonprod.
*/}}
{{ define "bcparks_vault_mount" -}}
{{- $licensePlate := (split "-" .Release.Namespace)._0 -}}
{{- if eq (include "bcparks.namespaceSuffix" .) "prod" -}}
{{ $licensePlate }}-prod
{{- else -}}
{{ $licensePlate }}-nonprod
{{- end -}}
{{- end -}}

{{/*
Notice key added to every Vault-managed Opaque Secret.
The "00_" prefix keeps it at the top of the key list in the OpenShift console.
*/}}
{{ define "bcparks_vault_managed_notice" -}}
00_VAULT_MANAGED_NOTICE: |-
  This secret is managed by BC Government HashiCorp Vault. Vault is the authoritative source of truth. Changes made directly to this OpenShift Secret are NOT synchronized back to Vault and will be overwritten by the next Helm upgrade.

  Vault access is limited by Platform Services and controlled through roles on registry.developer.gov.bc.ca. When this secret was created, only the Product Owner (Leah) and Technical Leads (Mike & Duncan) could be granted Vault access.

  To make a change permanent, update the secret in Vault and then perform a Helm upgrade. See "Running a Helm Upgrade":
  https://apps.nrs.gov.bc.ca/int/confluence/spaces/BCPRS/pages/317194679/Running+a+Helm+Upgrade

  In test and prod, Vault also contains S3_ACCESS_KEY_ID and S3_ACCESS_SECRET, which go in the s3-pgbackrest secret. Helm upgrade doesn't update that secret. It is applied manually following steps in helm/crunchy-postgres/README.md.
{{- end -}}
