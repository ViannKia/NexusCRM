import { createClient } from '@/lib/supabase/server';
import ContactForm from '@/components/features/contacts/contact-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default async function NewContactPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch companies for select options (filter deleted_at is null)
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('*')
    .is('deleted_at', null)
    .order('name', { ascending: true });

  // Fetch users (profiles) for select options
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });

  // Handle errors
  if (companiesError || usersError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create Contact</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          Failed to load form data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Contact</h1>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Enter the details for the new contact. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm companies={companies || []} users={users || []} />
        </CardContent>
      </Card>
    </div>
  );
}
