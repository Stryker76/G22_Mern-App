# PowerShell script to generate self-signed certificates for nginx
# Alternative to generate-certs.sh for Windows without OpenSSL

# Create certs directory if it doesn't exist
if (!(Test-Path "nginx\certs")) {
    New-Item -ItemType Directory -Path "nginx\certs" -Force
}

# Generate self-signed certificate using PowerShell
$cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "cert:\CurrentUser\My" -KeyAlgorithm RSA -KeyLength 2048 -NotAfter (Get-Date).AddDays(365)

# Export certificate to file
$certPath = "nginx\certs\localhost.crt"
$keyPath = "nginx\certs\localhost.key"

# Export certificate
Export-Certificate -Cert $cert -FilePath $certPath -Type CERT

# Export private key (requires secure string password)
$password = ConvertTo-SecureString -String "temp" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "nginx\certs\localhost.pfx" -Password $password

# Convert PFX to separate cert and key files using built-in .NET
$pfx = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2("nginx\certs\localhost.pfx", "temp", [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable)

# Export certificate in PEM format
$certBytes = $pfx.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$certPem = "-----BEGIN CERTIFICATE-----`n" + [System.Convert]::ToBase64String($certBytes, [System.Base64FormattingOptions]::InsertLineBreaks) + "`n-----END CERTIFICATE-----"
$certPem | Out-File -FilePath $certPath -Encoding ASCII

# Export private key in PEM format
$keyBytes = $pfx.PrivateKey.ExportRSAPrivateKey()
$keyPem = "-----BEGIN PRIVATE KEY-----`n" + [System.Convert]::ToBase64String($keyBytes, [System.Base64FormattingOptions]::InsertLineBreaks) + "`n-----END PRIVATE KEY-----"
$keyPem | Out-File -FilePath $keyPath -Encoding ASCII

Write-Host "SSL certificates generated successfully in nginx/certs/"
Write-Host "Note: For production use, obtain certificates from a trusted CA"

# Clean up temporary files
Remove-Item "nginx\certs\localhost.pfx" -ErrorAction SilentlyContinue
Remove-Item "cert:\CurrentUser\My\$($cert.Thumbprint)" -ErrorAction SilentlyContinue