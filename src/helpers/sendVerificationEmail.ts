import VerficationEmail from '../../emails/VerificationEmail'
import { ApiResponce } from '@/types/ApiResponse'

import { resend } from '@/lib/resend'

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string,
):Promise<ApiResponce> {
    try {
        
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymous Message | Verification Code',
            react: VerficationEmail({username, otp: verifycode})
          });

        return {success: true, message: "Successfully send verification Email"}
    } catch (emailError) {
        return {success: false, message: "Failed to send verification Email"}
    }

}