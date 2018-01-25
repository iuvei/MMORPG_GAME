//
//  SogouYuyinIOS.m
//  XYJGame
//
//  Created by moloong tech on 2018/1/23.
//
//

#import <Foundation/Foundation.h>
#import "SogouSemantic.h"
#import "SogouYuyinIOS.h"
#import "SougouYuyin.h"

@interface SogouYuyinIOS  ()<SogouSemanticDelegate>
{
    NSTimeInterval recordEnd;
}
@end


@implementation SogouYuyinIOS

//- (void)viewDidLoad {
//    [super viewDidLoad];
//}

static SogouYuyinIOS* _instance = nil;
+(SogouYuyinIOS*) shareInstance
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken,^{
        _instance = [[self alloc] init];
    });
    return _instance;
}

-(void) SetAppidAndAccesskey
{
//#error 测试用的appid的accesskey，请不要用在线上版本上。
    [SogouSemanticSetting setUserID:@"HMOX0181" andKey:@"jg1YoCKA"];
    [SogouSemanticSetting setNeedSemanticsRes:YES];
}

-(void) StartListening
{
    [[SogouSemantic sharedInstance] setDelegate:self];
    [[SogouSemantic sharedInstance] startListening];
    
}

-(void) StopListening
{
    [[SogouSemantic sharedInstance]stopListening];
}

-(void) CancelListening
{
    [[SogouSemantic sharedInstance]cancel];
    [[SogouSemantic sharedInstance]destroy];
}


- (void)onJSONResutls:(NSString *)jsonStr
{
    NSString* requestStr = nil;
    NSString* responseStr = nil;
    
    NSData * newdata = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];      //theXML为nsstring
    NSDictionary* jsonDic = [NSJSONSerialization JSONObjectWithData:newdata options:0 error:nil];
    NSArray* requestStrArr = [jsonDic objectForKey:@"content"];
    if ([requestStrArr count]>0) {
        requestStr = [requestStrArr objectAtIndex:0];
    }
    int status = [[jsonDic objectForKey:@"status"]intValue];
    if (status == 2 || status == 8) {
        NSLog(@"请求结束");
        CCLOG("请求结束");
        NSDictionary* semanticDic =  [jsonDic objectForKey:@"semantic_result"];
        NSArray* array = [semanticDic objectForKey:@"final_result"];
        if ([array count]>0) {
            NSDictionary * dic = [array objectAtIndex:0];
            responseStr = [dic objectForKey:@"answer"];
        }
        std::string *bar = new std::string([requestStr UTF8String]);
        SougouListenCallback(*bar);
    }

}
//返回错误时回调
- (void)onError:(NSError*)error{
    NSString* st = [NSString stringWithFormat:@"%@-code:%ld-%@",error.domain,(long)error.code,[error.userInfo objectForKey:@"reason"]];
    NSLog(@"error---------back");
    NSLog(@"%@",st);
}

// 录音结束后回调
- (void)onRecordStop{
    recordEnd = [[NSDate date]timeIntervalSince1970];
    NSLog(@"recordend-------------录音结束");
}




@end



















