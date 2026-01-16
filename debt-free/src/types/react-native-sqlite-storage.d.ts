declare module 'react-native-sqlite-storage' {
    export interface DatabaseParams {
        name: string;
        location?: string;
    }

    export interface ResultSet {
        insertId: number;
        rows: {
            length: number;
            item: (index: number) => any;
        };
    }

    export interface SQLiteDatabase {
        executeSql(
            sql: string,
            params?: any[],
        ): Promise<[ResultSet]>;
        close(): Promise<void>;
    }

    export default class SQLite {
        static DEBUG(debug: boolean): void;
        static enablePromise(enable: boolean): void;
        static openDatabase(params: DatabaseParams): Promise<SQLiteDatabase>;
    }
}
