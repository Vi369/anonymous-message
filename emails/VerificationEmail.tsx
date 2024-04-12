import {
    Html,
    Head,
    Font,
    Body,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button
} from '@react-email/components'

interface VerficationEmailProps{
    username: string,
    otp: string
}

export default function VerficationEmail({username,otp}:VerficationEmailProps) {
    return (
        <Html lang="en" dir='ltr'>
            <Head>
                <title>Email Verification</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
                <style>{`
                    body {
                        font-family: 'Roboto', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #007bff;
                        color: #fff;
                        padding: 20px;
                        text-align: center;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                    }
                    .content {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 0 0 5px 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .code {
                        font-size: 24px;
                        font-weight: bold;
                        color: #007bff;
                        margin-bottom: 15px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        color: #777;
                    }
                `}</style>
            </Head>
            <Body>
                <div className="container">
                    <div className="header">
                        <Heading>Verify Your Email Address</Heading>
                    </div>
                    <Section>
                        <Row>
                            <Text>Hello {username},</Text>
                        </Row>
                        <Row>
                            <Text>Welcome to our platform! To complete your sign-up process, please verify your email address by entering the following verification code:</Text>
                        </Row>
                        <Row>
                            <Text className="code">{otp}</Text>
                        </Row>
                        <Row>
                            <Text>This verification code is valid for a limited time only. If you did not request this verification, you can safely ignore this email.</Text>
                        </Row>
                        <Row>
                            <Text>Thank you for choosing our platform!</Text>
                        </Row>
                    </Section>
                    <div className="footer">
                        <Text>Best regards,<br />Anonymous-Message</Text>
                    </div>
                </div>
            </Body>
        </Html>
    );
  }