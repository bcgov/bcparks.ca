        'BEGIN PATCH FOR READING FROM WEB SERVER
		
        Dim oRequest As Object
        Dim sResponse As String
        Dim sUrl As String
        Set oRequest = CreateObject("MSXML2.ServerXMLHTTP")
        Dim fso As Object
        
        sUrl = Replace(oFile.Path, "X:\", "https://bcparks.ca/")
        sUrl = Replace(sUrl, "\", "/")
        sUrl = Replace(sUrl, "/index.html", "")
        
        oRequest.Open "GET", sUrl, False
        oRequest.send
        sResponse = oRequest.responseText
        
        Dim tempFolderPath As String
        Dim tempFilePath As String
        tempFolderPath = Environ("Temp") & "\ContentScrape"
        tempFilePath = tempFolderPath & "\" & Replace(Replace(oFile.Path, "X:\", ""), "\", "___")
        
        Set fso = CreateObject("Scripting.FileSystemObject")
        
        If Not fso.FolderExists(tempFolderPath) Then
            fso.CreateFolder tempFolderPath
        End If
        
        If fso.FileExists(tempFilePath) Then
            fso.DeleteFile tempFilePath
        End If
        
        Dim responseText As String
        
        If oRequest.Status = 200 Then
            responseText = oRequest.responseText
        Else
            responseText = " "
        End If
        
        With CreateObject("ADODB.Stream")
            .Type = 2 'adTypeText
            .Open
            .WriteText responseText
            .SaveToFile tempFilePath
            .Close
        End With
        
        Set oRequest = Nothing
		
        Set ts = fso.OpenTextFile(tempFilePath, 1, False, -2)
        
        'Set ts = oFile.OpenAsTextStream(1, -2)
        
        'END PATCH FOR READING FROM WEB SERVER
