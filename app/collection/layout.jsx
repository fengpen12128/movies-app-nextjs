'use client'

import SharedLayout from '../shared-layout/layout';
import {Card, Flex, Switch,Select} from '@radix-ui/themes';
import {useState} from 'react';
import {useRouter,usePathname} from 'next/navigation';

export default function CollectionLayout({children}) {
    const [arrange, setArrange] = useState('flex');
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (value) => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("arrange", value);
        setArrange(value)
        router.push(`${pathname}?${searchParams.toString()}`);
    }

    return (
        <SharedLayout>
          <Card className="my-3">
            <div className="flex gap-5">
              <div className="flex gap-2">
                <span>折叠</span>
                  <Select.Root value={arrange} onValueChange={handleChange} size="2" >
                      <Select.Trigger />
                      <Select.Content>
                          <Select.Item value="flex">Flex</Select.Item>
                          <Select.Item value="stack">Stack</Select.Item>
                      </Select.Content>
                  </Select.Root>
              </div>
            </div>
          </Card>
          {children}
        </SharedLayout>
    )
}
