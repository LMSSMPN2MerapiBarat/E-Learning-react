import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

interface CreateSiswaProps {
  onSuccess?: (newStudent?: any) => void;
}

export default function CreateSiswa({ onSuccess }: CreateSiswaProps) {
  const { data, setData, post, processing, reset, errors } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'siswa',
    nis: '',
    kelas: '',
    no_telp: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post('/admin/users', {
      onSuccess: (page) => {
        const newStudent = (page.props as any)?.newStudent;
        if (onSuccess) onSuccess(newStudent);
        reset();
      },
      onError: (err) => console.error(err),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label>Nama Lengkap</Label>
        <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <Label>Password</Label>
        <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>

      <div>
        <Label>NIS</Label>
        <Input value={data.nis} onChange={(e) => setData('nis', e.target.value)} />
      </div>

      <div>
        <Label>Kelas</Label>
        <Select value={data.kelas} onValueChange={(v) => setData('kelas', v)}>
          <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7A">7A</SelectItem>
            <SelectItem value="8A">8A</SelectItem>
            <SelectItem value="9A">9A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>No. Telepon</Label>
        <Input value={data.no_telp} onChange={(e) => setData('no_telp', e.target.value)} />
      </div>

      <Button type="submit" disabled={processing} className="w-full mt-2">
        Simpan
      </Button>
    </form>
  );
}
