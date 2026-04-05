'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2, Star } from 'lucide-react';
import { createMemberSchema, type CreateMemberInput, type Member } from '@tac/shared';
import { useAssemblies, usePositions } from '@/hooks/use-church-structure';
import { useMinistries } from '@/hooks/use-ministries';
import { useCreateMember, useMemberSearch, useUpdateMember } from '@/hooks/use-members';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface MemberFormProps {
  member?: Member | null;
}

type RelationField = 'father' | 'mother' | 'spouse';

const TAB_FIELDS: Record<string, Array<keyof CreateMemberInput>> = {
  personal: ['lastName', 'firstName', 'middleName', 'dateOfBirth', 'placeOfBirth', 'gender', 'nationality', 'phone', 'email', 'profileImage'],
  family: ['fatherName', 'fatherId', 'motherName', 'motherId', 'maritalStatus', 'spouseName', 'spouseId', 'numberOfChildren'],
  address: ['digitalAddress', 'postalAddress', 'city', 'hometownHouseNo', 'hometownPostalAddress', 'hometownTownRegion', 'hometownPhone'],
  church: ['assemblyId', 'baptismDate', 'membershipDate', 'positionIds', 'defaultPositionId', 'ministryIds', 'business'],
  kin: ['nextOfKinName', 'nextOfKinAddress', 'nextOfKinCityRegion', 'nextOfKinPhone', 'nextOfKinRelationship'],
  admin: ['membershipStatus', 'notes'],
};

function tabHasErrors(tab: string, errors: Record<string, unknown>) {
  return TAB_FIELDS[tab].some((field) => Boolean(errors[field]));
}

function RelatedMemberPicker({
  label,
  field,
  register,
  setValue,
  watch,
}: {
  label: string;
  field: RelationField;
  register: ReturnType<typeof useForm<CreateMemberInput>>['register'];
  setValue: ReturnType<typeof useForm<CreateMemberInput>>['setValue'];
  watch: ReturnType<typeof useForm<CreateMemberInput>>['watch'];
}) {
  const nameField = `${field}Name` as const;
  const idField = `${field}Id` as const;
  const [query, setQuery] = useState('');
  const { data: results = [] } = useMemberSearch(query);
  const linkedId = watch(idField);

  return (
    <div className="space-y-2 rounded-lg border border-border/70 p-3">
      <Label htmlFor={`${field}-name`}>{label}</Label>
      <Input id={`${field}-name`} {...register(nameField)} placeholder={`${label}`} />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={`Search ${label.toLowerCase()} in member records`}
      />
      {linkedId && (
        <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-xs">
          <span>Linked member ID: {linkedId}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setValue(idField, undefined)}
          >
            Clear link
          </Button>
        </div>
      )}
      {query.trim().length > 0 && results.length > 0 && (
        <div className="max-h-36 space-y-2 overflow-y-auto rounded-md border p-2">
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm hover:bg-muted"
              onClick={() => {
                setValue(nameField, `${result.firstName} ${result.lastName}`);
                setValue(idField, result.id);
                setQuery('');
              }}
            >
              <span>{result.firstName} {result.lastName}</span>
              <span className="text-xs text-muted-foreground">{result.phone || result.email || 'No contact'}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MemberForm({ member }: MemberFormProps) {
  const router = useRouter();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const { data: assemblies = [] } = useAssemblies();
  const { data: positions = [] } = usePositions();
  const { data: ministries = [] } = useMinistries();
  const [activeTab, setActiveTab] = useState('personal');
  const isEditing = Boolean(member);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMemberInput>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      city: '',
      dateOfBirth: '',
      ministryIds: [],
      positionIds: [],
      notes: '',
      membershipStatus: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (!member) {
      return;
    }

    reset({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      middleName: member.middleName || '',
      email: member.email || '',
      phone: member.phone || '',
      dateOfBirth: member.dateOfBirth?.split('T')[0],
      gender: member.gender,
      address: member.address || '',
      city: member.city || '',
      profileImage: member.profileImage || '',
      assemblyId: member.assemblyId,
      nationality: member.nationality || '',
      placeOfBirth: member.placeOfBirth || '',
      fatherName: member.fatherName || '',
      fatherId: member.fatherId,
      motherName: member.motherName || '',
      motherId: member.motherId,
      digitalAddress: member.digitalAddress || '',
      postalAddress: member.postalAddress || '',
      hometownHouseNo: member.hometownHouseNo || '',
      hometownPostalAddress: member.hometownPostalAddress || '',
      hometownTownRegion: member.hometownTownRegion || '',
      hometownPhone: member.hometownPhone || '',
      maritalStatus: member.maritalStatus,
      spouseName: member.spouseName || '',
      spouseId: member.spouseId,
      numberOfChildren: member.numberOfChildren,
      business: member.business || '',
      nextOfKinName: member.nextOfKinName || '',
      nextOfKinAddress: member.nextOfKinAddress || '',
      nextOfKinCityRegion: member.nextOfKinCityRegion || '',
      nextOfKinPhone: member.nextOfKinPhone || '',
      nextOfKinRelationship: member.nextOfKinRelationship || '',
      emergencyContact: member.emergencyContact || '',
      emergencyPhone: member.emergencyPhone || '',
      notes: member.notes || '',
      baptismDate: member.baptismDate?.split('T')[0],
      membershipDate: member.membershipDate?.split('T')[0],
      isBaptized: member.isBaptized,
      membershipStatus: member.membershipStatus,
      ministryIds: member.ministryMemberships?.map((membership) => membership.ministryId) || [],
      positionIds: member.positions?.map((position) => position.positionId) || [],
      defaultPositionId: member.positions?.find((position) => position.isDefault)?.positionId,
    });
  }, [member, reset]);

  const selectedAssemblyId = watch('assemblyId');
  const selectedAssembly = useMemo(
    () => assemblies.find((assembly) => assembly.id === selectedAssemblyId),
    [assemblies, selectedAssemblyId],
  );

  const selectedPositions = watch('positionIds') || [];
  const selectedMinistries = watch('ministryIds') || [];

  const toggleArrayValue = (field: 'positionIds' | 'ministryIds', value: string) => {
    const current = watch(field) || [];
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    setValue(field, next);

    if (field === 'positionIds' && !next.includes(watch('defaultPositionId') || '')) {
      setValue('defaultPositionId', next[0]);
    }
  };

  const onSubmit = async (data: CreateMemberInput) => {
    try {
      const payload = {
        ...data,
        numberOfChildren:
          data.numberOfChildren === undefined || Number.isNaN(Number(data.numberOfChildren))
            ? undefined
            : Number(data.numberOfChildren),
      };
      const saved = isEditing
        ? await updateMember.mutateAsync({ id: member!.id, ...payload })
        : await createMember.mutateAsync(payload);

      toast.success(isEditing ? 'Member updated successfully' : 'Member registered successfully');
      router.push(`/members/${saved.id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save member');
    }
  };

  const pending = createMember.isPending || updateMember.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href={member ? `/members/${member.id}` : '/members'} className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{member ? 'Edit Member' : 'Register New Member'}</h1>
          <p className="text-sm text-muted-foreground">Capture the full paper membership record in one place.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {member?.recordedBy && <p>Recorded by: {member.recordedBy}</p>}
          {member?.createdAt && <p>Created: {new Date(member.createdAt).toLocaleDateString()}</p>}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
          {[
            ['personal', 'Personal Information'],
            ['family', 'Family'],
            ['address', 'Address'],
            ['church', 'Church Information'],
            ['kin', 'Next of Kin'],
            ['admin', 'Admin'],
          ].map(([value, label]) => (
            <TabsTrigger key={value} value={value} className="rounded-full border px-4 py-2 data-[state=active]:border-sky-200 data-[state=active]:bg-sky-50">
              {label}
              {tabHasErrors(value, errors) && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500" />}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal" className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Surname</Label><Input {...register('lastName')} />{errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}</div>
            <div><Label>First/Other Name</Label><Input {...register('firstName')} />{errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}</div>
            <div><Label>Middle Name</Label><Input {...register('middleName')} /></div>
            <div><Label>Date of Birth</Label><Input type="date" {...register('dateOfBirth')} /></div>
            <div><Label>Place of Birth</Label><Input {...register('placeOfBirth')} /></div>
            <div className="space-y-2"><Label>Gender</Label><Select value={watch('gender') || ''} onValueChange={(value) => setValue('gender', value as 'MALE' | 'FEMALE')}><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger><SelectContent><SelectItem value="MALE">Male</SelectItem><SelectItem value="FEMALE">Female</SelectItem></SelectContent></Select></div>
            <div><Label>Nationality</Label><Input {...register('nationality')} /></div>
            <div><Label>Mobile No</Label><Input {...register('phone')} /></div>
            <div><Label>Email</Label><Input type="email" {...register('email')} /></div>
            <div><Label>Passport Photo URL</Label><Input {...register('profileImage')} /></div>
          </div>
        </TabsContent>

        <TabsContent value="family" className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-4">
            <RelatedMemberPicker label="Father's Name" field="father" register={register} setValue={setValue} watch={watch} />
            <RelatedMemberPicker label="Mother's Name" field="mother" register={register} setValue={setValue} watch={watch} />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Marital Status</Label><Select value={watch('maritalStatus') || ''} onValueChange={(value) => setValue('maritalStatus', value as CreateMemberInput['maritalStatus'])}><SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger><SelectContent><SelectItem value="SINGLE">Single</SelectItem><SelectItem value="MARRIED">Married</SelectItem><SelectItem value="DIVORCED">Divorced</SelectItem><SelectItem value="WIDOWED">Widowed</SelectItem></SelectContent></Select></div>
              <div><Label>Number of Children</Label><Input type="number" {...register('numberOfChildren', { valueAsNumber: true })} /></div>
            </div>
            <RelatedMemberPicker label="Husband's/Wife's Name" field="spouse" register={register} setValue={setValue} watch={watch} />
          </div>
        </TabsContent>

        <TabsContent value="address" className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold">Present Address</h3>
              <div><Label>House No / Digital Address</Label><Input {...register('digitalAddress')} /></div>
              <div><Label>Postal Address</Label><Input {...register('postalAddress')} /></div>
              <div><Label>City/Town</Label><Input {...register('city')} /></div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Hometown Address</h3>
              <div><Label>House No</Label><Input {...register('hometownHouseNo')} /></div>
              <div><Label>Postal Address</Label><Input {...register('hometownPostalAddress')} /></div>
              <div><Label>Town/Region</Label><Input {...register('hometownTownRegion')} /></div>
              <div><Label>Mob. No</Label><Input {...register('hometownPhone')} /></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="church" className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Assembly</Label>
                <Select value={watch('assemblyId') || ''} onValueChange={(value) => setValue('assemblyId', value)}>
                  <SelectTrigger><SelectValue placeholder="Select assembly" /></SelectTrigger>
                  <SelectContent>
                    {assemblies.map((assembly) => (
                      <SelectItem key={assembly.id} value={assembly.id}>
                        {assembly.name} ({assembly.circuit?.name || 'No circuit'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedAssembly?.circuit?.district && (
                  <p className="text-xs text-muted-foreground">
                    Circuit: {selectedAssembly.circuit.name} · District: {selectedAssembly.circuit.district.name}
                  </p>
                )}
              </div>
              <div><Label>Business/Occupation</Label><Input {...register('business')} /></div>
              <div><Label>Date of Baptism</Label><Input type="date" {...register('baptismDate')} /></div>
              <div><Label>Date of Membership</Label><Input type="date" {...register('membershipDate')} /></div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label>Positions</Label>
                <div className="space-y-2 rounded-xl border p-3">
                  {positions.map((position) => (
                    <label key={position.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPositions.includes(position.id)}
                          onChange={() => toggleArrayValue('positionIds', position.id)}
                        />
                        {position.name}
                      </span>
                      {selectedPositions.includes(position.id) && (
                        <button
                          type="button"
                          className={`inline-flex items-center gap-1 text-xs ${watch('defaultPositionId') === position.id ? 'text-amber-600' : 'text-muted-foreground'}`}
                          onClick={() => setValue('defaultPositionId', position.id)}
                        >
                          <Star className="h-3 w-3" />
                          Default
                        </button>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Ministries</Label>
                <div className="space-y-2 rounded-xl border p-3">
                  {ministries.map((ministry) => (
                    <label key={ministry.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedMinistries.includes(ministry.id)}
                        onChange={() => toggleArrayValue('ministryIds', ministry.id)}
                      />
                      {ministry.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kin" className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Name</Label><Input {...register('nextOfKinName')} /></div>
            <div><Label>Relationship</Label><Input {...register('nextOfKinRelationship')} /></div>
            <div><Label>Address</Label><Input {...register('nextOfKinAddress')} /></div>
            <div><Label>City/Town/Region</Label><Input {...register('nextOfKinCityRegion')} /></div>
            <div><Label>Mob. No</Label><Input {...register('nextOfKinPhone')} /></div>
          </div>
        </TabsContent>

        <TabsContent value="admin" className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Membership Status</Label><Select value={watch('membershipStatus') || 'ACTIVE'} onValueChange={(value) => setValue('membershipStatus', value as CreateMemberInput['membershipStatus'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="INACTIVE">Inactive</SelectItem><SelectItem value="VISITOR">Visitor</SelectItem><SelectItem value="DECEASED">Deceased</SelectItem><SelectItem value="TRANSFERRED">Transferred</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Baptized</Label><Select value={watch('isBaptized') ? 'YES' : 'NO'} onValueChange={(value) => setValue('isBaptized', value === 'YES')}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="YES">Yes</SelectItem><SelectItem value="NO">No</SelectItem></SelectContent></Select></div>
            <div className="md:col-span-2"><Label>Notes</Label><Textarea rows={5} {...register('notes')} /></div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-2xl border bg-white/95 p-4 shadow-lg backdrop-blur">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Member' : 'Register Member'}
        </Button>
      </div>
    </form>
  );
}
