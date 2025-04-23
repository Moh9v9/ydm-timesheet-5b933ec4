
// This is a simplified Database type definition that works with the existing setup
export type Database = {
  public: {
    Tables: {
      attendance_records: {
        Row: {
          id: string;
          employee_uuid: string;
          date: string;
          present: boolean;
          start_time?: string | null;
          end_time?: string | null;
          overtime_hours?: number | null;
          note?: string | null;
        };
        Insert: {
          id?: string;
          employee_uuid: string;
          date: string;
          present: boolean;
          start_time?: string | null;
          end_time?: string | null;
          overtime_hours?: number | null;
          note?: string | null;
        };
        Update: {
          id?: string;
          employee_uuid?: string;
          date?: string;
          present?: boolean;
          start_time?: string | null;
          end_time?: string | null;
          overtime_hours?: number | null;
          note?: string | null;
        };
      };
      employees: {
        Row: {
          id: string;
          fullName: string;
          iqamaNo?: string;
          jobTitle?: string;
          project?: string;
          location?: string;
          paymentType?: string;
          rateOfPayment?: number;
          sponsorship?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          fullName: string;
          iqamaNo?: string;
          jobTitle?: string;
          project?: string;
          location?: string;
          paymentType?: string;
          rateOfPayment?: number;
          sponsorship?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          fullName?: string;
          iqamaNo?: string;
          jobTitle?: string;
          project?: string;
          location?: string;
          paymentType?: string;
          rateOfPayment?: number;
          sponsorship?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          fullName: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          fullName: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          fullName?: string;
          role?: string;
          created_at?: string;
        };
      };
    };
  };
};
