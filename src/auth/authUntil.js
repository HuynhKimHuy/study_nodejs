import JWT from 'jsonwebtoken'
export const createTokenPair = async (payload, publicKey,privateKey)=>{
    try {
        const accessToken =  JWT.sign( payload, privateKey, {
            expiresIn: '2days'
        })

         const refreshToken =  JWT.sign( payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken,publicKey,(err,decode)=>{
            if(err){
                console.log("error verify",err);
            }
            else{
                console.log('decode verify',decode)
            }
        })
        return {accessToken, refreshToken}
    } catch (error) {
        next(error)
    }
}

