'Replace the entire function to support UTF-8 exports of JSON
Public Function ExportToJSON(FullPath As String, table As String, RowName As String) As Boolean
  Dim rs As DAO.Recordset
  Dim aRow As Variant
  Dim i As Long, ia As Long
  Dim iRowCount As Long, iFieldCount As Long, bNum As Boolean
  Dim sLine As String, sName As String, sVal As String
  Dim iFileNum As Integer, sOutput As String
  
  On Error GoTo ErrorHandler
    
  'Debug.Print FullPath & "; " & Table & "; " & RowName
  
  'iFileNum = FreeFile
  'Open FullPath For Output As #iFileNum
  Dim fso As Object
  Dim file As Object
  Set fso = CreateObject("Scripting.FileSystemObject")
  Set file = fso.CreateTextFile(FullPath, True, True)
    
  Set rs = CurrentDb.OpenRecordset(table, dbOpenSnapshot)
  
  With rs
    If .EOF Then
      iRowCount = 0
    Else
      .MoveLast
      iRowCount = .RecordCount
      .MoveFirst
      
      iFieldCount = .Fields.Count
      'Debug.Print "reading " & .Name
      'Debug.Print "iFieldCount: " & .Fields.Count
      
      sOutput = "{""" & RowName & """:[" & vbCrLf
      
      For i = 0 To (iRowCount - 1)
        bNum = False 'reset the num/boolean check
        If i = 0 Then
          sLine = "{"
        Else
          'sLine = sLine & "},{"
          sLine = sLine & "{"
        End If
        'Debug.Print sLine
        
        For ia = 0 To (iFieldCount - 1)
          'Debug.Print rs.Fields(ia).Name
          sName = rs.Fields(ia).Name
          If IsNull(rs.Fields(ia).value) Then
            sVal = ""
          Else
            'Debug.Print (rs.Fields(ia).Name & "; Type: " & rs.Fields(ia).Type)
            If rs.Fields(ia).Type = 12 And (rs.Fields(ia).Name = "Project" And 1 = 0) Then
              sVal = Base64EncodeString(rs.Fields(ia).value)
            Else
              sVal = rs.Fields(ia).value
            End If
          End If
          'escape special characters
          If sVal <> "" Then
            
            sVal = Replace(sVal, "Conductivity (25ûC)", "Conductivity (25&deg;C)")
            'sVal = Replace(sVal, """", "&rdquo;")
            sVal = Replace(sVal, "'", "&rsquo;")
            sVal = Replace(sVal, "’", "&rsquo;")
            sVal = Replace(sVal, "á", "&#160;")
            sVal = Replace(sVal, "é", "&#130;")
            sVal = Replace(sVal, "í", "&#161;")
            sVal = Replace(sVal, "ó", "&#162;")
            sVal = Replace(sVal, "ú", "&#250;")
            sVal = Replace(sVal, "û", "&#251;")
            sVal = Replace(sVal, "\", "&#192;")
            sVal = Replace(sVal, "°", "&deg;")
            sVal = Replace(sVal, "", "&#279;")
            sVal = Replace(sVal, "", " ")
            'sVal = Replace(sVal, vbCrLf, "<br>")
            sVal = Replace(sVal, vbCrLf, " ")
            sVal = Replace(sVal, Chr(10), " ")
            sVal = Replace(sVal, Chr(13), " ")
            sVal = Replace(sVal, "  ", " ")
            sVal = Replace(sVal, vbTab, " ")
            sVal = Replace(sVal, Chr(3), " ")  'end of text?
            'sVal = Replace(sVal, Chr(279), " ") 'e with dot above?
            'sVal = Replace(sVal, "</", "<\/")
            sVal = Replace(sVal, """", "\""")
            sVal = Trim(sVal)
            
          End If
          
          'Debug.Print (rs.Fields(ia).Name & ": " & rs.Fields(ia).Type)
          
          'check field to determine if boolean or numeric
                    
          '7  double
          '10 boolean
          '3  integer
          '8  Date
          '12 long text
          
          If rs.Fields(ia).Type = 3 Or rs.Fields(ia).Type = 4 Or rs.Fields(ia).Type = 7 Then 'Or rs.Fields(ia).Type = 10
            bNum = True
          End If
          
          If sName = "orcs" Then
            bNum = True
          End If
          
          If sVal = "True" Or sVal = "False" Then
            sVal = LCase(sVal)
            bNum = True
          End If
          
          'sLine = sLine & sVal
          If bNum = True And sVal <> "" And 1 = 0 Then ' And 1 = 0   |   temporarily disabled until parkinfo.js can be updated to accomodate non-string data types
            sLine = sLine & """" & sName & """:" & sVal
          Else
            sLine = sLine & """" & sName & """:""" & sVal & """"
          End If
          If ia < iFieldCount - 1 Then
            sLine = sLine & ","
          Else
            sLine = sLine & "}"
          End If
          
          bNum = False
        Next
        
        rs.MoveNext
        If rs.EOF Then
          sOutput = sOutput & sLine
        Else
          sOutput = sOutput & sLine & "," & vbCrLf
        End If
        sLine = ""
      Next
    End If
    'Debug.Print "count:" & iRowCount
  End With
  
  rs.Close
  Set rs = Nothing
  
  sOutput = sOutput & vbCrLf & "]}"
  'Debug.Print sOutput
  'Print #iFileNum, sOutput
  'Close #iFileNum
  file.WriteLine (sOutput)
  file.Close
  
  ExportToJSON = True
  Exit Function
ErrorHandler:
  If iFileNum > 0 Then Close #iFileNum
  Debug.Print "ExportToJSON error: " & Error
  Exit Function
End Function
