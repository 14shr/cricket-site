'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const formSchema = z.object({
  playerName: z.string().min(2, "Player name must be at least 2 characters."),
});

type SearchFormProps = {
  onSubmit: (playerName: string) => void;
  isPending: boolean;
};

export function SearchForm({ onSubmit, isPending }: SearchFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerName: '',
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.playerName);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-start gap-2">
        <FormField
          control={form.control}
          name="playerName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="sr-only">Player Name</FormLabel>
              <FormControl>
                <Input placeholder="Search teams or players..." {...field} className="text-base"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-auto" size="lg">
          {isPending ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-primary-foreground"></div>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
            </>
          )}
           <span className="sr-only">Search</span>
        </Button>
      </form>
    </Form>
  );
}
