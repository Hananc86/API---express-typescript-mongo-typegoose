interface Config {
	db: {
		password: string;
		host: string;
		username: string;
	}
}

const config: { [x: string]: Config } = {
	development: {
		db: {
			password: "passwordpassword",
			username: "superadmin",
			host: "cluster0-kjm42.mongodb.net/main?retryWrites=true&w=majority"
		}
	}
};

config.test = config.development;

const env = process.env.NODE_ENV || "development";

export default config[env];
