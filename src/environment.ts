let example_variable: string;

if (__ENVIRONMENT == "local") {
    example_variable = "debug";
}
else if (__ENVIRONMENT == "gh-pages") {
    example_variable = "prod";
}

export const environment = {
    env: example_variable,
    oAuthClientId: "766159746790-suj231pdh7ec2kb4iq92fh6l7ekkfh7t.apps.googleusercontent.com"
};
