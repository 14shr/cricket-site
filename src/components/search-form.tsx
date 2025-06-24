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
  }

  return (
    <div className="w-full">
      <h2 className="font-headline text-2xl font-bold">Player Search</h2>
      <p className="text-muted-foreground mb-4">Enter a player's name to get their career statistics, powered by AI.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-2">
          <FormField
            control={form.control}
            name="playerName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="sr-only">Player Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Virat Kohli" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-primary-foreground"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
