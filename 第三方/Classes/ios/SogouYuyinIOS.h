@interface SogouYuyinIOS : NSObject{
    
}
+(SogouYuyinIOS*) shareInstance;
-(void) SetAppidAndAccesskey;
-(void) StartListening;
-(void) StopListening;
-(void) CancelListening;
@end
