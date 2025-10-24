// resources/js/types/index.d.ts
import { PageProps as InertiaPageProps } from '@inertiajs/core'

declare global {
  interface PageProps extends InertiaPageProps {
    auth: {
      user: {
        id: number
        name: string
        email: string
        role: string
      }
    }
  }
}

export {}



export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
