import gzip, binascii, os  
from cStringIO import StringIO  
def gzip_compress(raw_data):  
    buf = StringIO()  
    f = gzip.GzipFile(mode='wb', fileobj=buf)  
    try:  
        f.write(raw_data)  
    finally:  
        f.close()  
    return buf.getvalue()  
  
def gzip_uncompress(c_data):  
    buf = StringIO(c_data)  
    f = gzip.GzipFile(mode = 'rb', fileobj = buf)  
    try:  
        r_data = f.read()  
    finally:  
        f.close()  
    return r_data  
  
  
def compress_file(fn_in, fn_out):  
    f_in = open(fn_in, 'rb')  
    f_out = gzip.open(fn_out, 'wb')  
    f_out.writelines(f_in)  
    f_out.close()  
    f_in.close()  
  
def uncompress_file(fn_in, fn_out):  
    f_in = gzip.open(fn_in, 'rb')  
    f_out = open(fn_out, 'wb')  
    file_content = f_in.read()  
    f_out.write(file_content)  
    f_out.close()  
    f_in.close()  
  
  
if __name__ == '__main__':  
    in_data = '--------start--------'  
    print in_data  
    out_data = gzip_compress(in_data)  
    print binascii.hexlify(out_data)  
  
    r_data = gzip_uncompress(out_data)  
  
    # raw_f = 'C:\Users\Administrator\Desktop\origin\ml_0_24.jpg'  
    # gzip_f2 = 'C:\Users\Administrator\Desktop\origin\ml_0_24.gz' 
    # compress_file(raw_f, gzip_f2) 
    # os.remove(os.path.join('C:\Users\Administrator\Desktop\origin' , '9.jpg'))
    # os.rename(os.path.join('C:\Users\Administrator\Desktop\origin' , '9.jpg'), os.path.join('C:\Users\Administrator\Desktop\origin' , '9.gz'))
    # uncompress_file(gzip_f2, raw_f)
#--------------------------------------------------------------------------------------#
    # search every files for file
    # for root, dirs, files in os.walk( 'G:\Projects\Cocos2d-js\SheepHome\\res\\rpg' ):
    #    for name in files:
    #       # print root, name
    #         aa = "\\"
    #         mm = root+aa+name
    #         # print mm
    #         nn = mm[-1]
    #         bb = mm[-4:-1]
    #         filetypee = bb + nn
    #         if filetypee == '.png':
    #             leng = len(mm)
    #             result = mm[0:leng-4] + '.gz'
    #             print mm
    #             # print result
    #             compress_file(mm,result)
    #             os.remove(os.path.join(root, name))
    #             os.rename(os.path.join(root, name[0:len(name)-4]+'.gz'), os.path.join(root,name[0:len(name)-4]+'.png'))

    # for root, dirs, files in os.walk( 'G:\Projects\cocoscreator\Themes' ):
    #    for name in files:
    #       # print root, name
    #         aa = "\\"
    #         mm = root+aa+name
    #         # print mm
    #         nn = mm[-1]
    #         bb = mm[-10:-1]
    #         filetypee = bb + nn
    #         if filetypee == '.pvr.plist':
    #             leng = len(mm)
    #             result = mm[0:leng-10] + '.plist'
    #             print mm
    #             print result
    #             os.rename(os.path.join(root, name[0:len(name)-10]+'.pvr.plist'), os.path.join(root,name[0:len(name)-10]+'.plist'))
    # for root, dirs, files in os.walk( 'E:\MoDragon\\xyjwork\XYJGame\\res\\animation' ):
    #    for name in files:
    #       # print root, name
    #         aa = "\\"
    #         mm = root+aa+name
    #         # print mm
    #         nn = mm[-1]
    #         bb = mm[-4:-1]
    #         filetypee = bb + nn
    #         if filetypee == '.png':
    #             leng = len(mm)
    #             result = mm[0:leng-4] + '.gz'
    #             pkmResult = mm[0:leng-4] + '.pkm'
    #             print mm
    #             #.png to .pkm
    #             command = 'etcpack ' + mm + ' ' + root + ' -c etc1 -aa'
    #             os.system(command)
    #             # remove origin png
    #             os.remove(os.path.join(root, name))
    #             #.pkm to .gz
    #             compress_file(pkmResult,result)
    #             #remove .pkm
    #             os.remove(os.path.join(root, name[0:len(name)-4]+'.pkm'))
    #             #remove .pgm
    #             # os.remove(os.path.join(root, name[0:len(name)-4]+'_alpha.pgm'))
    #             #rename .gz to .jpg
    #             os.rename(os.path.join(root, name[0:len(name)-4]+'.gz'), os.path.join(root,name[0:len(name)-4]+'.png'))
    print '--------finish--------'  