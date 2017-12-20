from collections import OrderedDict    
from pyexcel_xls import get_data  
from pyexcel_xls import save_data  
import copy
import json

filetxt = open("G:\Apan_WorkAbout\Python_Resource\excelToJson\\test.json", "wt")

result = []
keyList = []
def setdataValue(values):
	length = len(values)
	item = {}
	for index in range(length):
		if index < len(keyList):
			value = values[index]
			item[keyList[index]] = values[index]
	result.append(item)

def read_xls_file():
    xls_data = get_data(r"G:\\Apan_WorkAbout\\Python_Resource\\excelToJson\\shizhuang.xlsx")
    isTitle = True
    for sheet_n in xls_data.keys():  
      	lt = xls_data[sheet_n] 
      	for m in range(len(lt)):
      		if m == 1 and isTitle:
      			isTitle = False
      			for n in range(len(lt[m])):
      				# print lt[m][n],type(lt[m][n]),m,n
	  				key = str(lt[m][n])
	  				keyList.append(key)
		if m > 4:
			setdataValue(lt[m])

read_xls_file()
jsonStr = json.dumps(result)
filetxt.write(jsonStr)
print 'finish'